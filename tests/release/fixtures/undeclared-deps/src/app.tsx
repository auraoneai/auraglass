import React from "react";
import { Button } from "aura-glass";
import axios from "axios";
import lodash from "lodash";

export const App = () => <Button onClick={() => axios.get("/x").then(() => lodash.get({}, "a"))}>go</Button>;
