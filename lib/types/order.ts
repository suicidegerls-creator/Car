export interface CartItem {
  wheel_id: string
  wheel_name: string
  wheel_brand: string
  wheel_sku?: string
  wheel_image?: string
  diameter?: number
  width?: number
  pcd?: string
  et?: number
  price: number
  quantity: number
}

export interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_city: string
  delivery_address: string
  delivery_comment?: string
  total_amount: number
  items_count: number
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  wheel_id: string
  wheel_name: string
  wheel_brand: string
  wheel_sku?: string
  wheel_image?: string
  diameter?: number
  width?: number
  pcd?: string
  et?: number
  price: number
  quantity: number
  created_at: string
}

export const ORDER_STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждён',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

export const ORDER_STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  confirmed: 'bg-blue-500/20 text-blue-500',
  processing: 'bg-purple-500/20 text-purple-500',
  shipped: 'bg-cyan-500/20 text-cyan-500',
  delivered: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
}
