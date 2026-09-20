import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  district?: { name: string; name_bn: string } | null;
  upazila?: { name: string; name_bn: string } | null;
  total_amount: number;
  delivery_charge: number;
  items?: Array<{
    product_name: string;
    quantity: number;
  }>;
}

interface CourierSettings {
  courier_name: string;
  display_name: string;
  api_key: string | null;
  api_secret: string | null;
  access_token: string | null;
  is_enabled: boolean;
  default_weight: number;
}

// Steadfast API
async function bookSteadfast(order: OrderData, settings: CourierSettings): Promise<{ success: boolean; tracking_id?: string; consignment_id?: string; error?: string }> {
  if (!settings.api_key || !settings.api_secret) {
    return { success: false, error: 'Steadfast API credentials not configured' };
  }

  const productNames = order.items?.map(i => `${i.product_name} x${i.quantity}`).join(', ') || 'Product';
  const codAmount = order.total_amount;

  try {
    const response = await fetch('https://portal.steadfast.com.bd/api/v1/create_order', {
      method: 'POST',
      headers: {
        'Api-Key': settings.api_key,
        'Secret-Key': settings.api_secret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoice: order.order_number,
        recipient_name: order.customer_name,
        recipient_phone: order.customer_phone,
        recipient_address: order.delivery_address,
        cod_amount: codAmount,
        note: productNames,
        weight: settings.default_weight,
      }),
    });

    const data = await response.json();
    console.log('Steadfast response:', data);

    if (data.status === 200 && data.consignment) {
      return {
        success: true,
        tracking_id: data.consignment.tracking_code,
        consignment_id: data.consignment.consignment_id,
      };
    } else {
      return { success: false, error: data.message || 'Steadfast booking failed' };
    }
  } catch (error) {
    console.error('Steadfast error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Steadfast API error: ${errorMessage}` };
  }
}

// Pathao API
async function bookPathao(order: OrderData, settings: CourierSettings): Promise<{ success: boolean; tracking_id?: string; consignment_id?: string; error?: string }> {
  if (!settings.access_token) {
    return { success: false, error: 'Pathao access token not configured' };
  }

  const productNames = order.items?.map(i => `${i.product_name} x${i.quantity}`).join(', ') || 'Product';
  const codAmount = order.total_amount;

  try {
    // Pathao requires store_id, which should be in api_secret for now
    const storeId = settings.api_secret || '';
    
    const response = await fetch('https://api-hermes.pathao.com/aladdin/api/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        store_id: storeId,
        merchant_order_id: order.order_number,
        recipient_name: order.customer_name,
        recipient_phone: order.customer_phone,
        recipient_address: order.delivery_address,
        recipient_city: order.district?.name || 'Dhaka',
        recipient_zone: order.upazila?.name || '',
        delivery_type: 48, // Normal delivery
        item_type: 2, // Parcel
        special_instruction: productNames,
        item_quantity: order.items?.reduce((sum, i) => sum + i.quantity, 0) || 1,
        item_weight: settings.default_weight,
        amount_to_collect: codAmount,
        item_description: productNames,
      }),
    });

    const data = await response.json();
    console.log('Pathao response:', data);

    if (data.code === 200 && data.data) {
      return {
        success: true,
        tracking_id: data.data.consignment_id,
        consignment_id: data.data.consignment_id,
      };
    } else {
      return { success: false, error: data.message || 'Pathao booking failed' };
    }
  } catch (error) {
    console.error('Pathao error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Pathao API error: ${errorMessage}` };
  }
}

// RedX API
async function bookRedX(order: OrderData, settings: CourierSettings): Promise<{ success: boolean; tracking_id?: string; consignment_id?: string; error?: string }> {
  if (!settings.api_key) {
    return { success: false, error: 'RedX API token not configured' };
  }

  const productNames = order.items?.map(i => `${i.product_name} x${i.quantity}`).join(', ') || 'Product';
  const codAmount = order.total_amount;

  try {
    const response = await fetch('https://openapi.redx.com.bd/v1.0.0-beta/parcel', {
      method: 'POST',
      headers: {
        'API-ACCESS-TOKEN': `Bearer ${settings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        delivery_area: order.upazila?.name || order.district?.name || 'Dhaka',
        delivery_area_id: null,
        customer_address: order.delivery_address,
        merchant_invoice_id: order.order_number,
        cash_collection_amount: codAmount.toString(),
        parcel_weight: (settings.default_weight * 1000).toString(), // RedX uses grams
        instruction: productNames,
        value: codAmount.toString(),
        parcel_details_json: order.items?.map(i => ({
          name: i.product_name,
          category: 'General',
          value: '0',
        })) || [],
      }),
    });

    const data = await response.json();
    console.log('RedX response:', data);

    if (data.tracking_id) {
      return {
        success: true,
        tracking_id: data.tracking_id,
        consignment_id: data.tracking_id,
      };
    } else {
      return { success: false, error: data.message || data.error || 'RedX booking failed' };
    }
  } catch (error) {
    console.error('RedX error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `RedX API error: ${errorMessage}` };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authentication check - verify the caller is an admin
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized - No token provided' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { orderId } = await req.json();

    if (!orderId || typeof orderId !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid Order ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get order data with all required fields
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        district:districts(*),
        upazila:upazilas(*),
        items:order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if already booked
    if (order.courier_status === 'booked' && order.courier_consignment_id) {
      return new Response(JSON.stringify({ 
        error: 'Order already booked with courier',
        tracking_id: order.tracking_number,
        consignment_id: order.courier_consignment_id,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get default enabled courier settings
    const { data: courierSettings, error: settingsError } = await supabase
      .from('courier_settings')
      .select('*')
      .eq('is_enabled', true)
      .eq('is_default', true)
      .single();

    if (settingsError || !courierSettings) {
      // Try to get any enabled courier
      const { data: anyCourier } = await supabase
        .from('courier_settings')
        .select('*')
        .eq('is_enabled', true)
        .limit(1)
        .single();

      if (!anyCourier) {
        return new Response(JSON.stringify({ error: 'No courier is enabled. Please configure courier settings.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const settings = courierSettings as CourierSettings;
    let result: { success: boolean; tracking_id?: string; consignment_id?: string; error?: string };

    // Book based on courier type
    switch (settings.courier_name) {
      case 'steadfast':
        result = await bookSteadfast(order as OrderData, settings);
        break;
      case 'pathao':
        result = await bookPathao(order as OrderData, settings);
        break;
      case 'redx':
        result = await bookRedX(order as OrderData, settings);
        break;
      default:
        result = { success: false, error: 'Unknown courier type' };
    }

    if (result.success) {
      // Update order with tracking info - set status to 'shipped' when courier booking confirms
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          courier_name: settings.display_name,
          tracking_number: result.tracking_id,
          courier_consignment_id: result.consignment_id,
          courier_status: 'booked',
          courier_booked_at: new Date().toISOString(),
          order_status: 'shipped', // Auto-change to shipped when courier booking is confirmed
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Update error:', updateError);
        return new Response(JSON.stringify({ 
          error: 'Courier booked but failed to update order',
          tracking_id: result.tracking_id,
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Add courier note for the booking
      try {
        await supabase
          .from('courier_notes')
          .insert({
            order_id: orderId,
            source: 'system',
            message: `Courier booked successfully via ${settings.display_name}. Tracking ID: ${result.tracking_id}. Order status changed to Shipped.`,
            created_by: authData.user.id,
          });
      } catch (noteError) {
        console.error('Failed to add courier note:', noteError);
        // Don't fail the whole operation for a note
      }

      return new Response(JSON.stringify({
        success: true,
        courier: settings.display_name,
        tracking_id: result.tracking_id,
        consignment_id: result.consignment_id,
        order_status: 'shipped',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
