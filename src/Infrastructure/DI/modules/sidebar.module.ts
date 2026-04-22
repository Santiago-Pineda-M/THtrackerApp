import {
  GetSidebarStateUseCase,
  SaveSidebarStateUseCase,
} from '../../../Application/UseCases/Sidebar'
import { SidebarPloc } from '../../../Controllers/Sidebar/SidebarPloc'
import { sidebarRepository } from '../core/storage.config'

let _getSidebarStateUseCase: GetSidebarStateUseCase | null = null
const getGetSidebarStateUseCase = (): GetSidebarStateUseCase => {
  if (!_getSidebarStateUseCase)
    _getSidebarStateUseCase = new GetSidebarStateUseCase(sidebarRepository)
  return _getSidebarStateUseCase
}

let _saveSidebarStateUseCase: SaveSidebarStateUseCase | null = null
const getSaveSidebarStateUseCase = (): SaveSidebarStateUseCase => {
  if (!_saveSidebarStateUseCase)
    _saveSidebarStateUseCase = new SaveSidebarStateUseCase(sidebarRepository)
  return _saveSidebarStateUseCase
}

let _sidebarPloc: SidebarPloc | null = null
export const getSidebarPloc = (): SidebarPloc => {
  if (!_sidebarPloc)
    _sidebarPloc = new SidebarPloc(
      getGetSidebarStateUseCase(),
      getSaveSidebarStateUseCase()
    )
  return _sidebarPloc
}
