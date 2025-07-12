"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {

  const [search, setSearch] = useState("");

  const handelClick = () =>{
    if(search !== ""){
      toast.success("Thankyou for joining")
    }
    if(search == ""){
      toast.warning("Please Enter your email")
    }
    setSearch("");
  }

  return (
    <footer className="mt-10 text-sm">
      {/* Top newsletter bar */}
      <div className="bg-black text-white px-6 py-10 my-8 mx-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
          STAY UP TO DATE ABOUT OUR LATEST OFFERS
        </h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center bg-white rounded-full overflow-hidden px-4 w-full">
            <Mail className="text-gray-500" size={18} />
            <Input
            type="email"
            value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter your email address"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-black"
            />
          </div>
          <Button 
          onClick={handelClick}
          className="rounded-full bg-white text-black hover:bg-gray-200 cursor-pointer">
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
      <div className="bg-muted h-20 flex justify-center items-center sm:text-sm text-xs text-gray-600 ">This Website is made by Rohit Fartiyal for Tranning purpose</div>

   
    </footer>
  );
};

export default Footer;
