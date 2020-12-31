import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'status',
    loadChildren: () => import('./status/status.module').then( m => m.StatusPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'carrinho',
    loadChildren: () => import('./carrinho/carrinho.module').then( m => m.CarrinhoPageModule)
  },
  {
    path: 'chat/:id',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'item/:id',
    loadChildren: () => import('./item/item.module').then( m => m.ItemPageModule)
  },
  {
    path: 'item-venda/:id',
    loadChildren: () => import('./item-venda/item-venda.module').then( m => m.ItemVendaPageModule)
  },
  {
    path: 'item-view',
    loadChildren: () => import('./item-view/item-view.module').then( m => m.ItemViewPageModule)
  },
  {
    path: 'add-proc',
    loadChildren: () => import('./add-proc/add-proc.module').then( m => m.AddProcPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'entregar',
    loadChildren: () => import('./entregar/entregar.module').then( m => m.EntregarPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./root/root.module').then( m => m.RootPageModule)
  },
  {
    path: 'editar/:id',
    loadChildren: () => import('./editar/editar.module').then( m => m.EditarPageModule)
  },
  {
    path: 'politica',
    loadChildren: () => import('./politica/politica.module').then( m => m.PoliticaPageModule)
  },
  {
    path: 'ganhos',
    loadChildren: () => import('./ganhos/ganhos.module').then( m => m.GanhosPageModule)
  },
  {
    path: 'modal-venda',
    loadChildren: () => import('./modal-venda/modal-venda.module').then( m => m.ModalVendaPageModule)
  },
  {
    path: 'procurar',
    loadChildren: () => import('./procurar/procurar.module').then( m => m.ProcurarPageModule)
  },
  {
    path: 'register-prod',
    loadChildren: () => import('./register-prod/register-prod.module').then( m => m.RegisterProdPageModule)
  },
  {
    path: 'comentario',
    loadChildren: () => import('./comentario/comentario.module').then( m => m.ComentarioPageModule)
  },
  {
    path: 'orcamento',
    loadChildren: () => import('./orcamento/orcamento.module').then( m => m.OrcamentoPageModule)
  },
  {
    path: 'politica-orcamento',
    loadChildren: () => import('./politica-orcamento/politica-orcamento.module').then( m => m.PoliticaOrcamentoPageModule)
  },
  {
    path: 'modal-orcamento',
    loadChildren: () => import('./modal-orcamento/modal-orcamento.module').then( m => m.ModalOrcamentoPageModule)
  },
  {
    path: 'lista-orcamento',
    loadChildren: () => import('./lista-orcamento/lista-orcamento.module').then( m => m.ListaOrcamentoPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
