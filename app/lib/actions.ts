// user server를 사용함으로써 이 파일에서 export하는 모든 함수들이 Server Actions 임을
// 명시합니다.
// 이 파일에 존재하는 함수들은 번들링과정에서 자연스럽게 제외됩니다.
// 서버 컴포넌트에서도 동일한 방법으로 Server Actions를 정의할 수 있지만, NextJS팀은 이를 
// 추천하지 않습니다.
"use server";

// Zod는 typescript의 첫 번쨰 validation library로, object의 각 key의 type을 변경하고 새로운 Date field를 추가하는데 쉽고 간단한
// 방법을 제공합니다.
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // 참고로 NextJS팀에선 FormData가 너무 많을 경우, Object.fromEntries()와 entries()를 사용하는 것을
  // 추천한다.
  // const rawFromData = {
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // };

  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // <inpute type="number">는 사실 문자를 반환하기 때문에 amount는 string 타입이 된다.
  // 그렇기에 typescript는 이 처리를 해주지 않으면 오류를 발생시킬것입니다.
  // console.log(typeof rawFromData.amount); // string

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create a new invoice.');
  }
  

  // NextJS는 client-side router(경로)를 캐싱하여 저장하는 기능이 있는데, 이를 통해 다음번에 같은 요청이 발생할때, 캐싱된 데이터를 불러와서 서버의 부담을 줄입니다.
  // 하지만, 지금의 경우, 우리는 새로운 invoices를 만들었는데 만약 /dashboard/invoices로 이동하면 새롭게 추가된 invoices가 캐싱에 의해 보이지 않을 것입니다.
  // 그래서 우리는 revalidatePath()를 사용하여 서버에서 새로운 데이터를 받아와 캐싱된 데이터를 업데이트하고, 새로운 invoices를 보여줄 수 있게끔 해줍니다.
  revalidatePath("/dashboard/invoices");

  // 그런다음 우리는 새로운 invoices를 보여주는 페이지로 redirect를 해줍니다. 이는 next/navigation의 redirect를 사용하여 쉽게 할 수 있습니다.
  redirect("/dashboard/invoices");

}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update invoice.');
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to delete invoice.');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete invoice.');
  }
  revalidatePath('/dashboard/invoices');
}