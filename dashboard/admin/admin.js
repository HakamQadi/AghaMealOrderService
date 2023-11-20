import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource } from "@adminjs/mongoose";
// import Model from "../model/mealModel.js";
// const { Meal } = Model;
import Meal from "../model/mealModel.js";

AdminJS.registerAdapter({
  Database,
  Resource,
});

const mealNavigation = {
  name: "Add Meal",
  icon: "User",
};

const admin = new AdminJS({
  rootPath: '/admin', // Set the rootPath to the meals page
  resources: [
    {
      resource: Meal,
      options: {
        navigation: mealNavigation,
      },
    },
  ],
  branding: {
    logo: "",
    companyName: "Agha Meal",
    softwareBrothers: false,
  },
});


const adminRouter = AdminJSExpress.buildRouter(admin);

export default { admin, adminRouter };
