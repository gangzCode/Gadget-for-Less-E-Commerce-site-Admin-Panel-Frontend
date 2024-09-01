import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "fit-content",
  width: "100%",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <Image
      src="/images/logos/logo.jpg"
      alt="logo"
      height={90}
      width={220}
      priority
    />
  );
};

export default Logo;
