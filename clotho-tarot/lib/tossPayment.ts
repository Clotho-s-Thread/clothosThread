// lib/tossPayment.ts

import { v4 as uuidv4 } from 'uuid';

export interface PaymentResult {
  paymentKey: string;
  orderId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  message?: string;
}

/**
 * 주문 ID 생성
 * 예: points-1711234567890-a1b2c3d4
 */
export const generateOrderId = (type: 'points' | 'subscription'): string => {
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  return `${type}-${timestamp}-${uuid}`;
};

/**
 * 결제 확인 (서버에 전달)
 * ✅ /api/payment로 요청
 */
export const confirmPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<PaymentResult> => {
  try {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '결제 확인 실패');
    }

    return {
      paymentKey,
      orderId,
      amount,
      status: 'SUCCESS',
      message: data.message
    };
  } catch (error) {
    console.error('결제 확인 오류:', error);
    throw error;
  }
};

/**
 * Toss Payment Widget 요청
 */
export const requestTossPayment = async (data: {
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail: string;
  customerName: string;
}) => {
  console.warn('Toss Payment Widget 요청');
  // Toss SDK가 있을 경우 여기서 구현
};