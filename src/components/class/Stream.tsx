import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";

const borderRadiusValue = 7;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  textAlign: "center",
  borderRadius: borderRadiusValue,
  color: (theme.vars ?? theme).palette.text.secondary,
  overflow: "hidden", // clip children like CardMedia
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function Stream() {
  return (
    <Box sx={{ flexGrow: 1, p: 2, width: "100%", maxWidth: 1200 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Item>
            <CardMedia
              component="img"
              height={240}
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQRb1zne6GRvJcVo2zClCLoiWFv4aXxnhD4g&s"
              alt="Random Image"
            />
          </Item>
        </Grid>
        <Grid size={3}>
          <Item>size=3</Item>
        </Grid>
        <Grid size={9}>
          <Item>size=9</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
