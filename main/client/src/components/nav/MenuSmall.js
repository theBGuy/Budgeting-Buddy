import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

const MenuSmall = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(false);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = (e) => setAnchorEl(false);

  return (
    <>
      <IconButton
        aria-label="menu"
        id="basic-button"
        sx={{ cursor: "pointer", mr: 1, display: { md: "none" } }}
        onClick={handleOpen}
      >
        <MenuRoundedIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{ display: { md: "none" } }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText onClick={() => navigate("/createYear")}>
            Create Year
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MenuSmall;
