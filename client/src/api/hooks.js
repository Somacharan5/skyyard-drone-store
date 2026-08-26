import { useEffect, useState } from 'react';
import client from './client';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    client.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);
  return categories;
}
