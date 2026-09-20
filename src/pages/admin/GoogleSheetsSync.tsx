import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileSpreadsheet, Info } from 'lucide-react';

const GoogleSheetsSync = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6" />
            Google Sheets Sync
          </h1>
          <p className="text-muted-foreground">Import products from Google Sheets</p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Google Sheets Sync feature টি Laravel backend এ implement করা হয়নি। এই feature টি use করতে চাইলে Laravel এ একটি custom endpoint তৈরি করতে হবে যা Google Sheets API থেকে data পড়বে।
            <br /><br />
            এর পরিবর্তে আপনি <strong>Products</strong> page থেকে সরাসরি product add করতে পারেন।
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader><CardTitle>Alternative: Manual Product Import</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Products manually add করতে:</p>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Admin Panel → Products এ যান</li>
              <li>"Add Product" বাটনে ক্লিক করুন</li>
              <li>Product এর details fill করুন</li>
              <li>"Create Product" ক্লিক করুন</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default GoogleSheetsSync;
