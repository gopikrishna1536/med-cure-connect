import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const UploadPrescription = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or PDF file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save to database
      const { error: dbError } = await supabase
        .from('prescriptions')
        .insert({
          user_id: user.id,
          file_path: fileName,
        });

      if (dbError) throw dbError;

      setUploadSuccess(true);
      toast({
        title: "Success!",
        description: "Your prescription has been uploaded successfully",
      });
      
      setFile(null);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upload Prescription</h1>
          <p className="text-muted-foreground">Upload your medical prescription for verification</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prescription Upload</CardTitle>
            <CardDescription>
              Please upload a clear image or PDF of your prescription (Max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!uploadSuccess ? (
              <>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="prescription-upload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="prescription-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-lg font-semibold mb-2">
                      {file ? file.name : 'Click to upload'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or PDF (Max 5MB)
                    </p>
                  </label>
                </div>

                {file && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <FileText size={24} className="text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full"
                  size="lg"
                >
                  {uploading ? 'Uploading...' : 'Upload Prescription'}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto mb-4 text-success" size={64} />
                <h3 className="text-2xl font-semibold mb-2">Upload Successful!</h3>
                <p className="text-muted-foreground mb-6">
                  Your prescription has been received and will be verified shortly.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setUploadSuccess(false)} variant="outline">
                    Upload Another
                  </Button>
                  <Button onClick={() => navigate('/catalog')}>
                    Browse Medicines
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadPrescription;
