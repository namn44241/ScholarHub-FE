import { customFetch } from "@/lib/fetch"

export interface UploadResponse {
  success: boolean
  message: string
  payload: {
    file_url: string
    file_name: string
    file_type: string
    content_type: string
    size: number
  }
}

export interface MultipleUploadResponse {
  success: boolean
  message: string
  payload: {
    files: UploadResponse['payload'][]
  }
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await customFetch<UploadResponse>('/community/upload', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type to let browser set it with boundary
      })
      
      // Check if response has success property
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format')
      }
      
      if (!response.success) {
        throw new Error(response.message || 'Upload failed')
      }
      
      if (!response.payload || !response.payload.file_url) {
        throw new Error('Invalid response: missing file_url')
      }
      
      return response
    } catch (error) {
      console.error('Upload service error:', error)
      throw error
    }
  },

  async uploadMultipleFiles(files: File[]): Promise<MultipleUploadResponse> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    try {
      const response = await customFetch<MultipleUploadResponse>('/community/upload/multiple', {
        method: 'POST', 
        body: formData,
        headers: {} // Remove Content-Type to let browser set it with boundary
      })
      
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format')
      }
      
      if (!response.success) {
        throw new Error(response.message || 'Upload failed')
      }
      
      return response
    } catch (error) {
      console.error('Multiple upload service error:', error)
      throw error
    }
  },

  // Helper function to validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
      file: 25 * 1024 * 1024 // 25MB
    }

    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'],
      file: ['application/pdf', 'text/plain', 'application/msword', 
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }

    // Determine file category
    let category: keyof typeof allowedTypes | null = null
    for (const [cat, types] of Object.entries(allowedTypes)) {
      if (types.includes(file.type)) {
        category = cat as keyof typeof allowedTypes
        break
      }
    }

    if (!category) {
      return { valid: false, error: `File type ${file.type} not allowed` }
    }

    if (file.size > maxSizes[category]) {
      const maxSizeMB = maxSizes[category] / (1024 * 1024)
      return { valid: false, error: `File too large (max ${maxSizeMB}MB for ${category}s)` }
    }

    return { valid: true }
  }
} 