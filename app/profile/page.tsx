"use client";

import {
  User,
  GitBranch,
  Mail,
  FileSearch,
  AlertTriangle,
  Sparkles,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8">

      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center gap-6">

          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center">
            <User size={45} className="text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Shara
            </h1>

            <p className="text-slate-400 mt-1">
              Computer Engineering Student
            </p>
          </div>

        </div>
      </div>


      {/* Account Information */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-xl font-semibold text-white mb-6">
          Account Information
        </h2>


        <div className="space-y-5">

          <div className="flex items-center gap-3">
            <User className="text-indigo-400" size={20}/>
            <div>
              <p className="text-slate-400 text-sm">
                Name
              </p>
              <p className="text-white">
                Shara
              </p>
            </div>
          </div>


          <div className="flex items-center gap-3">
            <Mail className="text-indigo-400" size={20}/>
            <div>
              <p className="text-slate-400 text-sm">
                Email
              </p>
              <p className="text-white">
                shara@example.com
              </p>
            </div>
          </div>


          <div className="flex items-center gap-3">
            <GitBranch className="text-indigo-400" size={20}/>
            <div>
              <p className="text-slate-400 text-sm">
                GitHub
              </p>
              <p className="text-white">
                github.com/shara
              </p>
            </div>
          </div>


        </div>

      </div>



      {/* Developer Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-xl font-semibold text-white mb-6">
          Developer Stats
        </h2>


        <div className="grid md:grid-cols-3 gap-5">


          <StatCard
            icon={<FileSearch />}
            title="Repositories Analyzed"
            value="12"
          />


          <StatCard
            icon={<AlertTriangle />}
            title="Issues Found"
            value="45"
          />


          <StatCard
            icon={<Sparkles />}
            title="AI Reports Generated"
            value="8"
          />


        </div>

      </div>




      {/* Recent Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-xl font-semibold text-white mb-6">
          Recent Analysis
        </h2>


        <div className="space-y-4">


          <AnalysisCard
            name="AaharAI"
            tech="Next.js + TypeScript"
          />


          <AnalysisCard
            name="Portfolio Website"
            tech="React + Tailwind"
          />


        </div>


      </div>




      {/* Logout */}
      <button
        className="
        flex items-center gap-3
        bg-red-500 hover:bg-red-600
        text-white
        px-6 py-3
        rounded-xl
        transition
        "
      >

        <LogOut size={20}/>

        Logout

      </button>


    </div>
  );
}




function StatCard({
  icon,
  title,
  value,
}:{
  icon: React.ReactNode;
  title:string;
  value:string;
}){

return (

<div className="
bg-slate-800
rounded-xl
p-5
">

<div className="text-indigo-400 mb-3">
{icon}
</div>


<p className="text-3xl font-bold text-white">
{value}
</p>


<p className="text-slate-400 text-sm mt-1">
{title}
</p>


</div>

);

}




function AnalysisCard({
name,
tech
}:{
name:string;
tech:string;
}){

return (

<div className="
flex items-center justify-between
bg-slate-800
rounded-xl
p-5
">

<div>

<h3 className="text-white font-semibold">
{name}
</h3>

<p className="text-slate-400 text-sm mt-1">
{tech}
</p>

</div>


<div className="
text-green-400
text-xl
">
✓
</div>


</div>

);

}