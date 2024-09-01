import React, { useEffect, useState } from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import axios from "axios";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const [user, setUser] = useState({
    name: "",
    email: "",
    accessToken: "",
    isAdmin: false,
    isSuperAdmin: false,
    _id: false,
  });

  useEffect(() => {
    axios.get("/api/auth/getUser").then((res) => {
      if (res.data.success && res.data.success === true) {
        setUser(res.data.user);
      }
    });
  }, []);

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {Menuitems.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            if (!!item.condition) {
              switch (item.condition) {
                case "superadmin":
                  if (user.isSuperAdmin) return <NavGroup item={item} key={item.subheader} />;
                  break;
                default:
                  break;
              }
            } else {
              return <NavGroup item={item} key={item.subheader} />;
            }

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            if (!!item.condition) {
              switch (item.condition) {
                case "superadmin":
                  if (user.isSuperAdmin)
                    return (
                      <NavItem
                        item={item}
                        key={item.id}
                        pathDirect={pathDirect}
                        onClick={toggleMobileSidebar}
                      />
                    );
                  break;
                default:
                  break;
              }
            } else {
              return (
                <NavItem
                  item={item}
                  key={item.id}
                  pathDirect={pathDirect}
                  onClick={toggleMobileSidebar}
                />
              );
            }
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
