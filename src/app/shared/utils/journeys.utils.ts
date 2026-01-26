import { forkJoin, map, Observable } from "rxjs";
import { Course, Journey, JourneysSession } from "../../models/data.models";
import { inject } from "@angular/core";
import { DataService } from "../services/data.service";

