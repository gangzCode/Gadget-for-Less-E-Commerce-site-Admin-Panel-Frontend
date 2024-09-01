import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      if (user.isSuperAdmin) {
        const users = await baseApi.get("/user/", {
          headers: { token: `Bearer ${user.accessToken}` },
        });

        return Response.json({
          success: true,
          users: users.data,
        });
      }
      return Response.json({ success: false, message: "Failed" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}

export async function POST(request) {
  const userObject = await request.json();
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      if (user.isSuperAdmin) {
        const res = await baseApi.post("/auth/register", userObject, {
          headers: { token: `Bearer ${user.accessToken}` },
        });

        return Response.json({ success: true, message: "Created" });
      }
      return Response.json({ success: false, message: "Failed" });
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
      if (user.isSuperAdmin) {
        const res = await baseApi.put("/user/" + updatedItem.id, updatedItem, {
          headers: { token: `Bearer ${user.accessToken}` },
        });

        return Response.json({ success: true, message: "Created" });
      }
      return Response.json({ success: false, message: "Failed" });
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
  const userId = searchParams.get("id");
  console.log(userId);
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      if (user.isSuperAdmin) {
        const res = await baseApi.delete("/user/" + userId, {
          headers: { token: `Bearer ${user.accessToken}` },
        });

        return Response.json({ success: true, message: "Created" });
      }
      return Response.json({ success: false, message: "Failed" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
