import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";



export default function NavBar({ onSubmit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);


  const fetchSuggestions = async (searchTerm) => {
    try {
      if (searchTerm.length >= 3) {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=AIzaSyDqCT7y6GadJZms0_8QgjkhYqR9-rZ2_1s&cx=343c9c653e8e74939&q=${encodeURIComponent(
            searchTerm
          )}`
        );
        const data = await response.json();
        const suggestedQueries = data.items.map((item) => item.title);
        setSuggestions(suggestedQueries);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleAutocompleteChange = (event, value) => {
    setSearchTerm(value);
    onSubmit(value);
  };

  const handleChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if ( value && value.length >= 3) {
      await fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
    console.log(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(searchTerm);
    handleClose();
    console.log(searchTerm);
  };

  
  const handleClose = () => {
    setSuggestions([]); 
    
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Toolbar>
          <a href="src\App.js">
            <img
              style={{ margin: "10px", width: "39px" }}
              src={'/assets/ytlogo.png'}
              alt="ytlogo"
            />
          </a>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            YouTube
          </Typography>
          {/* <form onSubmit={handleSubmit}>
            <Autocomplete
              options={suggestions}
              sx={{ width: 300 }}
              value={searchTerm}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  sx={{
                    input: { cursor: "pointer" },
                    border: "12px",
                    bgcolor: "white",
                  }}
                  {...params}
                  label="Search"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              )}
            />
          </form> */}


          



          <form onSubmit={handleSubmit}>
            <Autocomplete
              options={suggestions}
              sx={{
                width: 300,
                "& .MuiAutocomplete-inputRoot": {
                  borderRadius: "12px",
                  backgroundColor: "grey",
                  "&:hover": {
                    backgroundColor: "grey", 
                  },
                },
              }}
              value={searchTerm}
              open={suggestions.length > 0 && searchTerm.length >= 3}
              noOptionsText={'Loading ...'}
              onClose={handleClose}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                sx={{
                  input: { cursor: "pointer", color: "white" },
                }}
                  {...params}
                  label="Search on YouTube"
                  variant="filled"
                  size="normal"
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              )}
            />
          </form>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
