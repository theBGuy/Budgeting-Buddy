import { TableRow, TableCell } from "@mui/material";
import { Link } from "react-router-dom";

const Envelope = ({ envelope, deleteEnvelope }) => (
  <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
    <TableCell component="th" scope="row">
      {envelope.category}
    </TableCell>
    <TableCell align="right">{envelope.budget}</TableCell>
    <TableCell align="right">{envelope.spent}</TableCell>
    <TableCell align="right">{envelope.remaining}</TableCell>
    <TableCell align="right">
      <Link className="btn btn-link" to={`/editEnvelope/${envelope._id}`}>
        Edit
      </Link>{" "}
      |
      <button
        className="btn btn-link"
        onClick={() => deleteEnvelope(envelope._id)}
      >
        Delete
      </button>
    </TableCell>
  </TableRow>
);

export default Envelope;
