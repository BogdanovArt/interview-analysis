import { Request, Response } from "express";

export type Controller = (props: ControllerProps) => Promise<void>;

export interface ControllerProps {
  req: Request;
  res: Response;
}
