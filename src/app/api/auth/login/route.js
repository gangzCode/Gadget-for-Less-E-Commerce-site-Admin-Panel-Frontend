import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function POST(request) {
  const loginData = await request.json();
  const cookieStore = cookies();

  try {
    const res = await baseApi.post("/auth/login/", loginData);
    const userData = res.data;

    cookieStore.set("user", JSON.stringify(userData), {
      secure: true,
      maxAge: 60 * 60 * 5,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }

  // .then((res) => {
  // })
  // .catch((e) => {
  //   return Response.json({ success: false, message: "" });
  // });
}
