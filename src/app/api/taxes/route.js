import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const taxes = await baseApi.get("/tax/", {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({
        success: true,
        taxes: taxes.data,
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
  const tax = await request.json();
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.post("/tax/", tax, {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({ success: true, message: "Created" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}

export async function PUT(request) {
  const updatedItem = await request.json();
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.put("/tax/" + updatedItem.id, updatedItem, {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({ success: true, message: "Created" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}

export async function DELETE(request) {
  // const tax = await request.json();
  const searchParams = request.nextUrl.searchParams;
  const taxId = searchParams.get("id");
  console.log(taxId);
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.delete("/tax/" + taxId, {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({ success: true, message: "Created" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
