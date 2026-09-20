import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try { return await api.get<any[]>('/wishlist'); }
      catch { return []; }
    },
    enabled: !!user,
  });

  const addToWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Please login to add to wishlist');
      return await api.post('/wishlist', { product_id: productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({ title: 'উইশলিস্টে যোগ হয়েছে', description: 'প্রোডাক্টটি আপনার উইশলিস্টে যোগ করা হয়েছে।' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message === 'Please login to add to wishlist' ? 'উইশলিস্টে যোগ করতে লগইন করুন।' : 'কিছু একটা সমস্যা হয়েছে।', variant: 'destructive' });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Not authenticated');
      return await api.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({ title: 'সরানো হয়েছে', description: 'প্রোডাক্টটি উইশলিস্ট থেকে সরানো হয়েছে।' });
    },
    onError: () => {
      toast({ title: 'ত্রুটি', description: 'কিছু একটা সমস্যা হয়েছে।', variant: 'destructive' });
    },
  });

  const isInWishlist = (productId: string) => wishlistItems.some((item: any) => item.product_id === productId);

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) { removeFromWishlist.mutate(productId); }
    else { addToWishlist.mutate(productId); }
  };

  return { wishlistItems, isLoading, addToWishlist: addToWishlist.mutate, removeFromWishlist: removeFromWishlist.mutate, isInWishlist, toggleWishlist, isAuthenticated: !!user };
};
