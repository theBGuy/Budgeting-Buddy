import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuSmall from "./MenuSmall";
import NavLogo from "./NavLogo";
import MenuMedium from "./MenuMedium";

function NavBar() {
  return (
    <AppBar>
      <Toolbar>
        <MenuSmall />
        <NavLogo />
        <MenuMedium />
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;
