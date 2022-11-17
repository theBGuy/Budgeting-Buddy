import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuSmall from "./MenuSmall";
import NavLogo from "./NavLogo";
import MenuMedium from "./MenuMedium";
import "bootstrap/dist/css/bootstrap.css";

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
