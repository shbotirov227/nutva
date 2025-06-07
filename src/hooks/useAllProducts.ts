import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { GetAllProducts } from '@/types/products/getAllProducts';

const getAllProducts = async (): Promise<GetAllProducts> => {
  const { data } = await apiClient.get('/Product');
  return data;
};

export const useAllProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: getAllProducts });
