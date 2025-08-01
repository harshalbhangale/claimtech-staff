import apiClient from './config';

export type DocumentType = 
  | 'care_pack'
  | 'dsar_request' 
  | 'letter_of_claim'
  | 'prowse_phillips_dba'
  | 'prowse_phillips_loa'
  | 'solvo_loa';

export interface DocumentDownloadRequest {
  document_type: DocumentType;
}

export interface DocumentDownloadResponse {
  presigned_url: string;
}

export const documentTypes: { value: DocumentType; label: string; description: string }[] = [
  {
    value: 'care_pack',
    label: 'Care Pack',
    description: 'Complete care package documentation'
  },
  {
    value: 'dsar_request',
    label: 'DSAR Request',
    description: 'Data Subject Access Request document'
  },
  {
    value: 'letter_of_claim',
    label: 'Letter of Claim',
    description: 'Official letter of claim document'
  },
  {
    value: 'prowse_phillips_dba',
    label: 'Prowse Phillips DSA',
    description: 'Prowse Phillips Data Sharing Agreement'
  },
  {
    value: 'prowse_phillips_loa',
    label: 'Prowse Phillips LOA',
    description: 'Prowse Phillips Letter of Authority'
  },
  {
    value: 'solvo_loa',
    label: 'Solvo LOA',
    description: 'Solvo Letter of Authority'
  }
];

export class DocumentDownloadService {
  /**
   * Get presigned URL for document download
   */
  static async getDocumentDownloadUrl(
    claimId: string, 
    documentType: DocumentType
  ): Promise<string> {
    try {
      console.log('📤 Making API request for document download');
      console.log('🔗 Endpoint:', `/staff-portal/claims/${claimId}/documents/`);
      console.log('📋 Request payload:', { document_type: documentType });
      console.log('🆔 Claim ID:', claimId);
      console.log('📄 Document Type:', documentType);

      const response = await apiClient.post<DocumentDownloadResponse>(
        `/staff-portal/claims/${claimId}/documents/`,
        { document_type: documentType }
      );
      
      console.log('✅ API Response received:', response);
      console.log('📊 Response status:', response.status);
      console.log('📦 Response data:', response.data);
      console.log('🔗 Presigned URL:', response.data.presigned_url);
      
      return response.data.presigned_url;
    } catch (error: any) {
      console.error('❌ Error getting document download URL:', error);
      console.error('📊 Error status:', error.response?.status);
      console.error('📦 Error data:', error.response?.data);
      console.error('📝 Error message:', error.message);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to get download URL'
      );
    }
  }

  /**
   * Download document using presigned URL - Opens directly in new tab
   */
  static async downloadDocument(
    presignedUrl: string, 
    filename?: string
  ): Promise<void> {
    try {
      console.log('🔗 Opening presigned URL directly');
      console.log('🌐 URL:', presignedUrl);
      console.log('📁 Filename:', filename || 'document.pdf');
      
      // Open the presigned URL directly in a new tab/window
      const newWindow = window.open(presignedUrl, '_blank');
      
      if (newWindow) {
        console.log('✅ Successfully opened download link in new tab');
        // Focus the new window
        newWindow.focus();
      } else {
        console.warn('⚠️ Popup blocked - falling back to direct navigation');
        // Fallback: navigate to the URL directly
        window.location.href = presignedUrl;
      }
    } catch (error) {
      console.error('❌ Error opening download document:', error);
      throw new Error('Failed to open download document');
    }
  }

  /**
   * Complete download flow - get URL and download
   */
  static async downloadClaimDocument(
    claimId: string,
    documentType: DocumentType,
    filename?: string
  ): Promise<void> {
    try {
      console.log('🚀 Starting complete download flow');
      console.log('🆔 Claim ID:', claimId);
      console.log('📄 Document Type:', documentType);
      console.log('📁 Filename:', filename);

      // Get presigned URL
      console.log('📡 Step 1: Getting presigned URL...');
      const presignedUrl = await this.getDocumentDownloadUrl(claimId, documentType);
      
      // Generate filename if not provided
      const defaultFilename = filename || `${documentType}_${claimId}.pdf`;
      console.log('📁 Generated filename:', defaultFilename);
      
      // Download the document
      console.log('⬇️ Step 2: Opening download link...');
      await this.downloadDocument(presignedUrl, defaultFilename);
      
      console.log('🎉 Download flow completed successfully');
    } catch (error) {
      console.error('❌ Error in complete download flow:', error);
      throw error;
    }
  }

  /**
   * Get document type display name
   */
  static getDocumentTypeLabel(documentType: DocumentType): string {
    const docType = documentTypes.find(type => type.value === documentType);
    return docType?.label || documentType;
  }

  /**
   * Get document type description
   */
  static getDocumentTypeDescription(documentType: DocumentType): string {
    const docType = documentTypes.find(type => type.value === documentType);
    return docType?.description || '';
  }

  /**
   * Validate document type
   */
  static isValidDocumentType(type: string): type is DocumentType {
    return documentTypes.some(docType => docType.value === type);
  }
}

export default DocumentDownloadService;