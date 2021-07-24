import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SendIcon from "@material-ui/icons/Send";
import { TextField, Button } from "@material-ui/core";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db, { auth } from "./firebase";
import { useState } from "react";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  chat: {
    margin: 0,
    background: "#add8e6",
    overflowY: "auto",
    overflowX: "hidden",
    height: "580px",
    marginBottom: 20,
    borderRadius: 20,
    paddingRight: 30,
  },

  meCon: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    listStyleType: "none",
    padding: 10,
  },

  youCon: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    listStyleType: "none",
    padding: 10,
  },
  me: {
    padding: 10,
    color: "#fff",
    borderRadius: 5,
    backgroundColor: "#00cd00",
    width: 150,
    wordWrap: "break-word",
    lineHeight: 2,
    textAlign: "center",
  },
  you: {
    padding: 10,
    color: "#fff",
    borderRadius: 5,
    backgroundColor: "#00008b",
    width: 150,
    wordWrap: "break-word",
    lineHeight: 2,
    textAlign: "center",
  },
  form: {
    display: "flex",
  },

  active: {
    background: "#ddd",
  },
  textCenter: {
    textAlign: "center",
  },
  noMessage: {
    textAlign: "center",
    fontWeight: 100,
    fontStyle: "italic",
    fontSize: 25,
  },
  img: {
    borderRadius: 5,
  },
  sender: {
    display: "block",
    margin: "0 auto",
    textTransform: "capitalize",
    marginBottom: 10,
  },
}));

const Home = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [text, setText] = useState("");

  const [dataUsers] = useCollectionData(db.collection("users"));
  const users = dataUsers?.filter((u) => u.email !== user.email);

  const [dataMessages] = useCollectionData(
    db.collection(`${user?.email}-messages`).orderBy("time", "asc")
  );

  const messages = dataMessages?.filter(
    (m) =>
      m.senderMail === currentUser?.email ||
      m.receiverMail === currentUser?.email
  );

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const SelectUser = (user) => {
    setCurrentUser(user);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (text.length && text !== " ") {
      await db.collection(`${user.email}-messages`).add({
        sender: user.displayName,
        senderMail: user.email,
        receiverMail: currentUser.email,
        message: text,
        time: new Date().getTime(),
      });

      await db.collection(`${currentUser.email}-messages`).add({
        sender: user.displayName,
        senderMail: user.email,
        receiverMail: currentUser.email,
        message: text,
        time: new Date().getTime(),
      });
    }
    setText("");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {currentUser ? currentUser.name : "React Chat App"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {users?.map((user, index) => (
            <ListItem
              button
              key={index}
              onClick={() => SelectUser(user)}
              className={user === currentUser ? classes.active : null}
            >
              <ListItemIcon>
                <img
                  src={user.photoURL}
                  className={classes.img}
                  height="40"
                  alt=""
                />
              </ListItemIcon>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}

          <ListItem>
            <ListItemText className={classes.textCenter}>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                onClick={() => auth.signOut()}
              >
                Sign Out
              </Button>
            </ListItemText>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div className={classes.chat}>
          <ul>
            {messages?.length && currentUser
              ? messages?.map((m, i) => (
                  <li
                    key={i}
                    className={
                      m.senderMail === user.email
                        ? classes.meCon
                        : classes.youCon
                    }
                  >
                    <div
                      className={
                        m.senderMail === user.email ? classes.me : classes.you
                      }
                    >
                      <Button variant="contained" className={classes.sender}>
                        {m.sender?.split(" ")[0]}
                      </Button>
                      {m.message}
                    </div>
                  </li>
                ))
              : null}
          </ul>
          {messages?.length === 0 && !currentUser ? (
            <Typography className={classes.noMessage} variant="h4">
              Choose your user to start messaging
            </Typography>
          ) : null}

          {messages?.length === 0 && currentUser ? (
            <Typography className={classes.noMessage} variant="h4">
              There are no messages sent or received.
            </Typography>
          ) : null}
        </div>
        {currentUser ? (
          <form
            className={classes.form}
            noValidate
            autoComplete="off"
            onSubmit={sendMessage}
          >
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              size="small"
              label="Send"
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </form>
        ) : null}
      </main>
    </div>
  );
};

export default Home;
