import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Logo from "../logo.png";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db, { auth, provider } from "./firebase";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    padding: 20,
    margin: "20px auto",
  },
  area: {
    textAlign: "center",
  },
  btn: {
    margin: "0 auto",
  },
});

const SignIn = () => {
  const classes = useStyles();
  const [dataUsers] = useCollectionData(db.collection("users"));

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then(({ user }) => {
        let check = dataUsers.find((u) => u.email === user.email);
        if (!check) {
          db.collection("users").add({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <Card className={classes.root} elevation={3}>
      <CardActionArea className={classes.area}>
        <img src={Logo} width="150" alt="" />
        <CardContent>
          <Typography variant="h5">React Chat App</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          onClick={signIn}
          variant="contained"
          color="primary"
          className={classes.btn}
        >
          Sign In With Google
        </Button>
      </CardActions>
    </Card>
  );
};

export default SignIn;
