import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount, points } = body;

    console.log('💳 결제 확인 요청:', {
      paymentKey,
      orderId,
      amount,
      points
    });

    // ✅ 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        {
          code: 'INVALID_REQUEST',
          message: '필수 파라미터가 누락되었습니다 (paymentKey, orderId, amount)'
        },
        { status: 400 }
      );
    }

    // ✅ Toss 시크릿 키 (환경 변수에서 가져오기)
    const tossSecretKey = process.env.TOSS_SECRET_KEY;

    if (!tossSecretKey) {
      console.error('❌ TOSS_SECRET_KEY 환경 변수가 설정되지 않았습니다');
      return NextResponse.json(
        {
          code: 'SERVER_ERROR',
          message: '서버 설정 오류'
        },
        { status: 500 }
      );
    }

    // ✅ Basic 인증 헤더 생성
    // Toss API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않음
    // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가
    const encryptedSecretKey = Buffer.from(`${tossSecretKey}:`).toString('base64');

    console.log('⏳ Toss API 호출 중...');

    // ✅ Toss API 호출 (결제 승인)
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        amount: parseInt(amount),
        paymentKey: paymentKey,
      }),
    });

    const responseData = await response.json();

    // ✅ 결제 성공
    if (response.ok) {
      console.log('✅ 결제 승인 완료:', responseData);

      // ✅ DB에 결제 기록 저장 (선택사항 - Prisma 사용 시)
      try {
        // await prisma.payment.create({
        //   data: {
        //     orderId,
        //     amount,
        //     points: parseInt(points || '0'),
        //     paymentKey,
        //     status: 'completed',
        //     tossResponse: JSON.stringify(responseData)
        //   }
        // });
        console.log('📝 결제 기록 저장 (DB 연동 필요)');
      } catch (dbError) {
        console.error('⚠️ DB 저장 실패:', dbError);
        // DB 저장 실패해도 결제 승인은 완료되었으므로 성공으로 처리
      }

      return NextResponse.json(
        {
          code: 'SUCCESS',
          message: '결제가 완료되었습니다',
          data: {
            ...responseData,
            points: points || 0
          }
        },
        { status: 200 }
      );
    }

    // ❌ 결제 실패
    console.error('❌ 결제 승인 실패:', responseData);

    return NextResponse.json(
      {
        code: responseData.code || 'PAYMENT_FAILED',
        message: responseData.message || '결제 처리 중 오류가 발생했습니다'
      },
      { status: response.status }
    );

  } catch (error: any) {
    console.error('❌ API 요청 중 에러:', error);

    return NextResponse.json(
      {
        code: 'SERVER_ERROR',
        message: error.message || '서버 오류가 발생했습니다'
      },
      { status: 500 }
    );
  }
}