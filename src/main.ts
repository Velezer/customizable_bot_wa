import { app } from "./app";
import { DataSources } from "./typeorm/data-source";


app(DataSources.postgres)
