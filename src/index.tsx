import { initializeWidget } from "@vikadata/widget-sdk";
import { ContributionsGraph } from "./contributions.graph";

initializeWidget(ContributionsGraph, process.env.WIDGET_PACKAGE_ID);
