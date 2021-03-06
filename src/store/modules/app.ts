import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, getSize, setSidebarStatus, setLanguage, setSize } from '@/utils/cookies'
import { getLocale } from '@/lang'
import { getGovInfoName } from '@/utils/session'
import store from '@/store'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: string
  isFullscreen: boolean
  dialogTableVisible: boolean
  ListPopupsShow: boolean
  currentTitle: string
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }

  public device = DeviceType.Desktop
  public language = getLocale()
  public size = getSize() || 'medium'
  public isFullscreen = false
  public dialogTableVisible = false
  public ListPopupsShow = false
  public currentTitle = getGovInfoName() || ''
  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language
    setLanguage(this.language)
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
    setSize(this.size)
  }

  @Mutation
  private SET_IS_FULLSCREEN(isFullscreen: boolean){
    this.isFullscreen = isFullscreen
  }

  @Mutation
  private SET_DIALOGTABLEVISIBLE(dialogTableVisible: boolean){
    this.dialogTableVisible = dialogTableVisible
  }
  @Mutation
  private LIST_POPUPS_SHOW(ListPopupsShow: boolean){
    this.ListPopupsShow = ListPopupsShow
  }

  @Mutation
  private SET_CURRENT_TITLE(currentTitle: string){
    this.currentTitle = currentTitle
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public SetLanguage(language: string) {
    this.SET_LANGUAGE(language)
  }

  @Action
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }

  @Action
  public SetIsFullscreen(isFullscreen: boolean){
    this.SET_IS_FULLSCREEN(isFullscreen)
  }

  @Action
  public SetDialogTableVisible(dialogTableVisible: boolean){
    this.SET_DIALOGTABLEVISIBLE(dialogTableVisible)
  }

  @Action
  public SetListPopupsShow(ListPopupsShow: boolean){
    this.LIST_POPUPS_SHOW(ListPopupsShow)
  }
  @Action
  public setCurrentTitle(currentTitle: string){
    this.SET_CURRENT_TITLE(currentTitle)
  }
}

export const AppModule = getModule(App)
