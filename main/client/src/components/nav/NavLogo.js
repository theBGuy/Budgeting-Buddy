import Box from "@mui/material/Box";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const NavLogo = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{ display: "flex", cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <AssessmentIcon fontSize="large" sx={{ mr: 1 }} />

      <Typography
        variant="h6"
        sx={{ mr: 2 }}
        onClick={() => navigate("/createYear")}
      >
        Budget Buddy
      </Typography>
    </Box>
  );
};

export default NavLogo;
