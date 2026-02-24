import { useMutation } from '@tanstack/react-query'
import { apiClient } from './client'
import type {
  ApiResponse,
  UploadFolder,
  UploadImageResponse,
  UploadImagesResponse,
  DeleteImagesRequest,
  DeleteImagesResponse,
} from './types'

// ==================== API Functions ====================

const uploadImage = async ({ file, folder = 'horses' }: { file: File; folder?: UploadFolder }) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await apiClient.post<ApiResponse<UploadImageResponse>>(
    `/upload/image?folder=${folder}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data.data
}

const uploadImages = async ({ files, folder = 'horses' }: { files: File[]; folder?: UploadFolder }) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })

  const response = await apiClient.post<ApiResponse<UploadImagesResponse>>(
    `/upload/images?folder=${folder}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data.data
}

const deleteImage = async (publicId: string) => {
  const encodedId = encodeURIComponent(publicId)
  const response = await apiClient.delete<ApiResponse>(`/upload/image/${encodedId}`)
  return response.data
}

const deleteImages = async (data: DeleteImagesRequest) => {
  const response = await apiClient.delete<ApiResponse<DeleteImagesResponse>>('/upload/images', { data })
  return response.data.data
}

// ==================== Hooks ====================

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
  })
}

export const useUploadImages = () => {
  return useMutation({
    mutationFn: uploadImages,
  })
}

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: deleteImage,
  })
}

export const useDeleteImages = () => {
  return useMutation({
    mutationFn: deleteImages,
  })
}
