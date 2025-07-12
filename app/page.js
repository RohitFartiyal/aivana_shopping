import { getFeaturedProduct, getLatestProduct } from "@/actions/home";
import ProductCard from "@/components/card";
import { Button } from "@/components/ui/button";
// import { featuredCars } from "@/lib/data";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import CustomerReviews from "@/components/happyCustomer";

export default async function Home() {
  const featuredProducts = await getFeaturedProduct()
  const latestProducts = await getLatestProduct()

  return (
    <>
      <section className="xl:pt-15 md:pt-25 pt-20 bg-neutral-100 flex  w-full ">
        <div className="flex md:flex-row sm:flex-col flex-col justify-between w-full lg:px-20 md:px-10 sm:px-10 px-8 padding ">
          <div className="md:w-[60%] w-full flex items-center md:mt-0  mt-10 ">
            <div className="w-full">
              <h1 className="xl:text-7xl lg:text-6xl md:text-5xl sm:text-6xl text-4xl font-extrabold text-gray-900">FIND CLOTHES</h1>
              <h1 className="xl:text-7xl lg:text-6xl md:text-5xl sm:text-6xl text-4xl font-extrabold text-gray-900">THAT MATCHES</h1>
              <h1 className="xl:text-7xl lg:text-6xl md:text-5xl sm:text-6xl text-4xl font-extrabold text-gray-900">YOUR STYLE</h1>
              <p className="text-md text-gray-600 py-5 lg:pr-20 xl:pr-40 w-[90%]">Shop the latest trends, exclusive deals, and essentials designed to make your life easier and better.</p>

              <Button className="rounded-4xl text-sm font-medium px-15 py-5 cursor-pointer md:w-auto w-[60%] mb-8">Shop Now</Button>

              <div className="flex justify-between xl:w-[80%] md:w-[90%] xmd sm:w-[80%] ">
                <div>
                  <h1 className="lg:text-4xl sm:text-3xl  text-xl font-bold">200+</h1>
                  <p className="lg:text-sm text-xs text-gray-600">International Brands</p>
                </div>
                {/* <span className=" text-5xl">|</span> */}
                <div>
                  <h1 className="lg:text-4xl sm:text-3xl text-xl lg:font-bold font-bold">2,000+</h1>
                  <p className="lg:text-sm text-xs text-gray-600">High Quality Products</p>
                </div>
                <div>
                  <h1 className="lg:text-4xl sm:text-3xl text-xl font-bold">30,000+</h1>
                  <p className="lg:text-sm text-xs text-gray-600">Happy Customer</p>
                </div>
              </div>
            </div>

          </div>
          <div className=" md:w-[40%] md:h-auto sm:h-[500px] h-[400px]">
            <img
              src={"/pn.png"}
              className=" w-full h-full xl:object-contain md:object-cover object-contain "

            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-neutral-100">
        <div className="bg-black text-amber-100 lg:py-8 py-5">
          <ul className="flex justify-between gap-8 overflow-x-auto whitespace-nowrap xl:mx-20 lg:mx-10 mx-4
           scrollbar-hide">
            <li className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold">VERSACE</li>
            <li className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold">GUCCI</li>
            <li className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold">PRADA</li>
            <li className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold">ZARA</li>
            <li className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold">CALVIN KLEIN</li>
          </ul>
        </div>

        <div className="md:mx-20 mx-8 pb-20">
          <h1 className="font-extrabold sm:text-5xl text-4xl text-gray-900 text-center mb-10 mt-20">TOP SELLINGS</h1>
          <div className="grid grid-cols-1 lsm md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts?.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href={'/shop'}><Button variant='outline' className='w-40 rounded-4xl'>View All</Button></Link>
          </div>
        </div>
      </section>


      {/* Top Selling */}
      <section className="bg-neutral-100">

        <div className="md:mx-20 mx-8 pb-20">
          <h1 className="font-extrabold sm:text-5xl text-4xl text-gray-900 text-center mb-10 pt-10">NEW ARRIVALS</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProducts?.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href={'/shop'}><Button variant='outline' className='w-40 rounded-4xl'>View All</Button></Link>
          </div>
        </div>
      </section>


      {/* Browse by dress style */}
      <section className="bg-neutral-100 pb-10">

        <div className="sm:mx-20 mx-6 py-10 lg:px-20 sm:px-10 px-4 bg-white rounded-md">
          <h1 className="font-extrabold lg:text-5xl md:text-4xl text-3xl text-gray-900 text-center mb-10">
            BROWSE BY DRESS STYLE
          </h1>

          {/* Upper row */}
          <div className="grid grid-cols-5 lg:gap-4 gap-2 lg:mb-4 mb-2">
            {/* Casual */}
            <div className="col-span-2 lg:h-80 sm:h-60 h-50 relative group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/shop?dressType=casual+wear'}>
                    <Image
                      src="/dress/casual.jpg"
                      alt="Casual Dress"
                      fill
                      className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-102 cursor-pointer"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Casual Dresses</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Formal */}
            <div className="col-span-3 lg:h-80 sm:h-60 h-50 relative group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/shop?dressType=formal+wear'}>
                  <Image
                    src="/dress/formal.jpg"
                    alt="Formal Dress"
                    fill
                    className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-102 cursor-pointer"
                  />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Formal Dresses</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Lower row */}
          <div className="grid grid-cols-5 lg:gap-4 gap-2">
            {/* gymwear */}
            <div className="col-span-3 lg:h-80 sm:h-60 h-50 relative group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/shop?dressType=gym+wear'}>
                  <Image
                    src="/dress/gymwear.jpg"
                    alt="Party Dress"
                    fill
                    className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-102 cursor-pointer"
                  />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Gym Wear</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Partywaer */}
            <div className="col-span-2 lg:h-80 sm:h-60 h-50 relative group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/shop?dressType=party+wear'}>
                  <Image
                    src="/dress/partywear.jpg"
                    alt="Party Dress"
                    fill
                    className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-102 cursor-pointer"
                  />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Party Dresses</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>


      <section>
        <CustomerReviews/>
      </section>
    </>
  );
}
