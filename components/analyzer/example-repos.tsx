export default function ExampleRepos() {

const repos=[
"vercel/next.js",
"facebook/react",
"microsoft/vscode"
];


return(
<div>

<h2 className="text-xl font-semibold mb-4">
Try Example Repositories
</h2>


<div className="grid md:grid-cols-3 gap-4">

{
repos.map((repo)=>(
<button
key={repo}
className="bg-[#1E293B] border border-slate-700 rounded-xl p-5 hover:border-violet-500 transition text-left"
>
{repo}
</button>
))
}

</div>

</div>
)

}