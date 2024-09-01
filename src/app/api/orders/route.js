import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      let orders;

      if (id) {
        // orders = await baseApi.get(`/order/${id}`, {
        //   headers: { token: `Bearer ${user.accessToken}` },
        // });
      } else {
        orders = await baseApi.get("/order/getAllOrders", {
          headers: { token: `Bearer ${user.accessToken}` },
        });
      }


      return Response.json({
        success: true,
        orders: orders.data,
      });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}

export async function POST(request) {
  const cookieStore = cookies();
  const updatedOrder = await request.json();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const res = await baseApi.post("/order/updateOrder", updatedOrder, {
        headers: { token: `Bearer ${user.accessToken}` },
      });


      return Response.json({ success: true, message: "Updated" });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
