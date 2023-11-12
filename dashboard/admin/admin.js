import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource } from "@adminjs/mongoose";
import Model from "../model/mealModel.js";
const { Meal } = Model;

AdminJS.registerAdapter({
  Database,
  Resource,
});

const mealNavigation = {
  name: "Add Meal",
  icon: "User",
};

const admin = new AdminJS({
  // rootPath: '/admin/resources/Meals', // Set the rootPath to the meals page
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
