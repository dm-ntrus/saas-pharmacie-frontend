"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useCreateCustomRole } from "@/hooks/api/useCustomRoles";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { ALL_PERMISSIONS } from "@/types/permissions";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  name: z.string().min(2).regex(/^[a-z0-9_-]+$/, "Uniquement minuscules, chiffres, _ et -"),
  displayName: z.string().min(2),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, "Au moins une permission"),
});
type FormData = z.infer<typeof schema>;

export default function NewRolePage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_CREATE]}>
      <NewRoleForm />
    </ModuleGuard>
  );
}

function NewRoleForm() {
  const router = useRouter();
  const { buildPath: path } = useTenantPath();
  const createRole = useCreateCustomRole();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", displayName: "", description: "", permissions: [] },
  });
  const selectedPerms = watch("permissions") ?? [];

  const togglePerm = (p: string) => {
    const next = selectedPerms.includes(p) ? selectedPerms.filter((x) => x !== p) : [...selectedPerms, p];
    setValue("permissions", next, { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    createRole.mutate(
      { name: data.name, displayName: data.displayName, description: data.description, permissions: data.permissions },
      { onSuccess: (res) => { if (res?.id) router.push(path(`/settings/roles/${res.id}`)); else router.push(path("/settings/roles")); } },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild><Link href={path("/settings/roles")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau rôle</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Créer un rôle personnalisé</p></div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card><CardHeader><CardTitle>Informations</CardTitle></CardHeader><CardContent className="space-y-4">
          <Input label="Identifiant (minuscules, _ -)" {...register("name")} error={errors.name?.message} />
          <Input label="Nom affiché" {...register("displayName")} error={errors.displayName?.message} />
          <Input label="Description" {...register("description")} />
        </CardContent></Card>
        <Card className="mt-6"><CardHeader><CardTitle>Permissions ({selectedPerms.length})</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-500 mb-3">Cochez les permissions à attribuer.</p><div className="max-h-64 overflow-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"><input type="hidden" {...register("permissions")} />{ALL_PERMISSIONS.slice(0, 80).map((p) => (<label key={p} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={selectedPerms.includes(p)} onChange={() => togglePerm(p)} className="rounded border-slate-300" /><span className="font-mono text-xs truncate">{p}</span></label>))}</div>{errors.permissions && <p className="text-sm text-red-600 mt-2">{errors.permissions.message}</p>}</CardContent></Card>
        <div className="flex justify-end gap-2 mt-6"><Button variant="outline" type="button" asChild><Link href={path("/settings/roles")}>Annuler</Link></Button><Button type="submit" loading={createRole.isPending}>Créer</Button></div>
      </form>
    </div>
  );
}
