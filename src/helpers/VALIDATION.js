import * as yup from "yup";

export const validation = yup.object({
  cpu: yup.string().required("please select an option to begin"),
  gpu: yup.string().required("please select an option to begin"),
  ram: yup.string().required("please select an option to begin"),
  motherboard: yup.string().required("please select an option to begin"),
  monitor: yup.string().required("please select an option to begin"),
  "Disk-Space": yup.string().required("please select an option to begin"),
});
