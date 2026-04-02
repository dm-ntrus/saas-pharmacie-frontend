import { tokenService } from "./token.service";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";
import { getCookie } from "@/utils/cookies";

function buildAuthHeaders(orgId: string): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Organization-ID": orgId,
  };
  const token = tokenService.getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const csrf = getCookie("csrf_token");
  if (csrf) headers["X-CSRF-Token"] = csrf;
  return headers;
}

class FileUploadService {
  async uploadFile(
    orgId: string,
    file: File,
    type: 'product_image' | 'document' | 'prescription'
  ): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(
      `${getApiBaseUrl()}/organizations/${orgId}/files/upload`,
      {
        method: 'POST',
        headers: buildAuthHeaders(orgId),
        credentials: 'include',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async uploadProductImage(
    orgId: string,
    productId: string,
    file: File
  ): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
      `${getApiBaseUrl()}/organizations/${orgId}/inventory/products/${productId}/image`,
      {
        method: 'POST',
        headers: buildAuthHeaders(orgId),
        credentials: 'include',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    return response.json();
  }
}

export const fileUploadService = new FileUploadService();