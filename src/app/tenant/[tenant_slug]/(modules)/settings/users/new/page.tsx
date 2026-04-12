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
import { useCreateIdentityUser } from "@/hooks/api/useIdentity";
import { useOrganization } from "@/context/OrganizationContext";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  password: z.string().min(8, "Min. 8 caractères").optional().or(z.literal("")),
  phone: z.string().optional(),
  organizationId: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function NewUserPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_ASSIGN]}>
      <NewUserForm />
    </ModuleGuard>
  );
}

function NewUserForm() {
  const router = useRouter();
  const { buildPath: path } = useTenantPath();
  const { currentOrganization, organizations } = useOrganization();
  const createUser = useCreateIdentityUser();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", firstName: "", lastName: "", password: "", phone: "", organizationId: currentOrganization?.id ?? "" },
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
      organizationId: data.organizationId || currentOrganization?.id,
      password: data.password && data.password.length >= 8 ? data.password : undefined,
    };
    createUser.mutate(payload, {
      onSuccess: (res) => {
        if (res?.id) router.push(path(`/settings/users/${res.id}`));
        else router.push(path("/settings/users"));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={path("/settings/users")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Créer un utilisateur</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Invitation ou création de compte</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Prénom" {...register("firstName")} error={errors.firstName?.message} />
              <Input label="Nom" {...register("lastName")} error={errors.lastName?.message} />
            </div>
            <Input label="Téléphone" {...register("phone")} />
            <Input label="Mot de passe (optionnel, sinon invitation par email)" type="password" {...register("password")} error={errors.password?.message} />
            {organizations.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Organisation</label>
                <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" {...register("organizationId")}>
                  <option value="">Sélectionner</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" asChild><Link href={path("/settings/users")}>Annuler</Link></Button>
              <Button type="submit" loading={createUser.isPending}>Créer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
