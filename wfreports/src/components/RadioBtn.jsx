import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const RadioBtn = ({ value, handleSelectionChange }) => {
  return (
    <FormControl component="fieldset">
      <FormLabel>Direction</FormLabel>
      <RadioGroup
        row
        aria-label="Direction"
        value={value}
        onChange={handleSelectionChange}
      >
        <FormControlLabel
          value="Inbound"
          control={<Radio color="primary" />}
          label="Inbound"
        />
        <FormControlLabel
          value="Outbound"
          control={<Radio color="primary" />}
          label="Outbound"
        />
        <FormControlLabel
          value="Return"
          control={<Radio color="primary" />}
          label="Return"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default RadioBtn;
