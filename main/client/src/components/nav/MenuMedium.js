import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
const MenuMedium = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => navigate("/createYear")}
        aria-label="create-year"
        variant="text"
        sx={{ color: "white", display: { xs: "none", md: "block" } }}
      >
        Create Year
      </Button>
    </>
  );
};

export default MenuMedium;
