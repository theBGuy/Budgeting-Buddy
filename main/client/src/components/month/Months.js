import Month from "./Month";

const Months = ({ year, months }) => {
  return (
    <>
      {months.map((month) => (
        <Month year={year} month={month} key={month._id} />
      ))}
    </>
  );
};

export default Months;
