import {
  AccountBalance,
  AccountBalanceOutlined,
  MailOutline,
  PersonOutline,
  ShoppingCart,
  Storefront,
} from "@mui/icons-material";
import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconFilter,
  IconUserPlus,
  IconListDetails,
  IconBox,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Product Management",
  },
  {
    id: uniqueId(),
    title: "Categories",
    icon: IconListDetails,
    href: "/categories",
  },
  {
    id: uniqueId(),
    title: "Filters",
    icon: IconFilter,
    href: "/filters",
  },
  {
    id: uniqueId(),
    title: "Products",
    icon: IconBox,
    href: "/products",
  },
  {
    navlabel: true,
    subheader: "Order management",
  },
  {
    id: uniqueId(),
    title: "Orders",
    icon: Storefront,
    href: "/orders",
  },
  {
    id: uniqueId(),
    title: "Taxes",
    icon: AccountBalanceOutlined,
    href: "/taxes",
  },
  {
    navlabel: true,
    subheader: "Admin management",
    condition: "superadmin",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: PersonOutline,
    href: "/users",
    condition: "superadmin",
  },
  {
    navlabel: true,
    subheader: "Other management",
  },
  {
    id: uniqueId(),
    title: "Subscribers",
    icon: MailOutline,
    href: "/subscribers",
  },
];

export default Menuitems;
