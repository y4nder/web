import { defineStore } from "pinia";

const useTatakform = defineStore("tatakform", () => {
  const colleges: CollegeModel[] = [];
  const student = {} as TatakformStudent;

  return {
    colleges, student
  }
});

export {
  useTatakform
};