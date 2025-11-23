import { tokenService } from "./token.service";

class FileUploadService {
  /**
   * Uploader un fichier
   */
  async uploadFile(
    orgId: string,
    file: File,
    type: 'product_image' | 'document' | 'prescription'
  ): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const token = tokenService.getAccessToken();
    
    const response = await fetch(
      `/api/organizations/${orgId}/files/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Organization-ID': orgId
        },
        body: formData
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json();
  }
  
  /**
   * Uploader une image de produit
   */
  async uploadProductImage(
    orgId: string,
    productId: string,
    file: File
  ): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = tokenService.getAccessToken();
    
    const response = await fetch(
      `/api/organizations/${orgId}/inventory/products/${productId}/image`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Organization-ID': orgId
        },
        body: formData
      }
    );
    
    if (!response.ok) {
      throw new Error('Image upload failed');
    }
    
    return response.json();
  }
}

export const fileUploadService = new FileUploadService();