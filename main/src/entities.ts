import { UmSystemUser } from "./entity/um/um-system-user.entity"
import { UmUserRole } from "./entity/um/um-user-role"
import { UmRole } from "./entity/um/umRole"
import { BasePerson } from "./entity/base/basePerson"

import { PriPrisoner } from "./entity/pri/prisoner/priPrisoner"
import { PriPrisonerKeyView } from "./entity/pri/prisoner/priPrisonerKeyView"
import { PriMovementDeparturePack } from "./entity/pri/movement/PriMovementDeparturePack"
import { PriMovementDeparture } from "./entity/pri/movement/PriMovementDeparture"
import { PriMovementArrivalPack } from "./entity/pri/movement/PriMovementArrivalPack"
import { PriEmployee } from "./entity/pri/employee/priEmployee"
import { PriInfoPositionType } from "./entity/info/priInfoPositionType"
import { PriInfoMilitaryRank } from "./entity/info/priInfoMilitaryRank"
import { PriInfoDepartmentType } from "./entity/info/priInfoDepartmentType"
import { PriInfoDepartment } from "./entity/info/priInfoDepartment"
import { PriEmployeeKey } from "./entity/pri/employee/priEmployeeKey"
import { PriAdministrativeDecType } from "./entity/pri/administrative/priAdministrativeDecType"
import { PriAdministrativeDecision } from "./entity/pri/administrative/priAdministrativeDecision"
import { PriPrisonerKey } from "./entity/pri/prisoner/PriPrisonerKey"
import { PriOfficer } from "./entity/pri/officer/PriOfficer"
import { PriMovementArrival } from "./entity/pri/movement/PriMovementArrival"
import { MovementDeparture } from "./entity/pri/movement/movementDeparture.entity"
import { MovementArrival } from "./entity/pri/movement/movementArrival.entity"
import { PriPrisonerAccountBook } from "./entity/pri/prisoner/priPrisonerAccountBook"
import { PriPrisonerAccountBookView } from "./entity/pri/prisoner/priPrisonerAccountBookView"
import { MenuSettings } from "./entity/pri/settings/MenuSettings"
import { ActionSettings } from "./entity/pri/settings/ActionSettings"
import { RoleActionSettings } from "./entity/pri/settings/RoleActionSettings"
import { RoleMenuSettings } from "./entity/pri/settings/RoleMenuSettings"
import { PriNotificationMView } from "./entity/pri/notification/priNotificationMView"
import { PriInfoAddressType } from "./entity/info/priInfoAddressType"
import { PriInfoAimagCity } from "./entity/info/priInfoAimagCity"
import { PriInfoSoumDistrict } from "./entity/info/priInfoSoumDistrict"
import { PriInfoBagKhoroo } from "./entity/info/priInfoBagKhoroo"
import { RefCountry } from "./entity/ref/refCountry"
import { PriAddress } from "./entity/pri/address/priAddress"
import { PriInfoTransactionType } from "./entity/info/priInfoTransactionType"
import { PriInfoBookType } from "./entity/info/priInfoBookType"
import { PriLeaveView } from "./entity/pri/leave/PriLeaveView.entity"
import { PriDecisionView } from "./entity/pri/decision/priDecisionView"
import { PriDecision } from "./entity/pri/decision/priDecision"
import { PriTsagdanTimeView } from "./entity/pri/detention/PriTsagdanTimeView"
import { PriInfoDecisionType } from "./entity/info/priInfoDecisionType"
import { PriLeave } from "./entity/pri/leave/PriLeave.entity"
import { PriInfoLeaveType } from "./entity/info/priInfoLeaveType.entity"
import { PriLaborView } from "./entity/pri/labor/PriLaborView"
import { PriLabor } from "./entity/pri/labor/PriLabor"
import { PriPrisonerLabor } from "./entity/pri/labor/PriPrisonerLabor"
import { PriInfoLaborType } from "./entity/info/priInfoLaborType"
import { WfmStatus } from "./entity/wfmStatus.entity"
import { PriPrisonerLaborView } from "./entity/pri/labor/PriPrisonerLaborView"
import { PriRotlView } from "./entity/pri/rotl/PriRotlView.entity"
import { PriRotl } from "./entity/pri/rotl/PriRotl.entity"
import { PriTrainingView } from "./entity/pri/training/PriTrainingView.entity"
import { PriTrainingPrisonerView } from "./entity/pri/training/PriTrainingPrisonerView.entity"
import { PriTraining } from "./entity/pri/training/PriTraining.entity"
import { PriTrainingPrisoner } from "./entity/pri/training/PriTrainingPrisoner.entity"
import { PriTrainingPrisonerKeyView } from "./entity/pri/training/PriTrainingPrisonerKeyView.entity"
import { PriLoginLog } from "./entity/log/PriLoginLog.entity"
import { PriLoginLogView } from "./entity/log/PriLoginLogView.entity"
import { PriPrisonerBreak } from "./entity/pri/break/PriPrisonerBreak"
import { PriPrisonerBreakView } from "./entity/pri/break/PriPrisonerBreakView"

import { PriRelease } from "./entity/pri/release/PriRelease"
import { PriReleaseView } from "./entity/pri/release/PriReleaseView"
import { PriOffenceActionView } from "./entity/pri/offence/PriOffenceActionView.entity"


const Entities = [
  WfmStatus,
  MenuSettings, ActionSettings, RoleMenuSettings, RoleActionSettings,
  UmSystemUser, UmUserRole, UmRole,
  BasePerson,
  PriEmployee, PriEmployeeKey,
  PriPrisoner, PriPrisonerKeyView, PriPrisonerKey,
  MovementDeparture, MovementArrival,
  PriMovementDeparturePack, PriMovementDeparture, PriMovementArrivalPack,

  PriInfoDepartment, PriInfoDepartmentType, PriInfoPositionType, PriInfoMilitaryRank,
  PriAdministrativeDecType, PriAdministrativeDecision, PriInfoAddressType, PriInfoAimagCity, PriInfoSoumDistrict, PriInfoBagKhoroo,
  RefCountry, PriAddress, PriInfoTransactionType, PriInfoBookType, PriInfoDecisionType,

  PriOfficer,
  PriPrisonerAccountBook, PriPrisonerAccountBookView,
  PriNotificationMView, PriMovementArrival,

  PriLeaveView, PriLeave, PriInfoLeaveType,

  PriDecision, PriDecisionView,
  PriTsagdanTimeView,PriLaborView,
  PriLabor, PriPrisonerLabor, PriPrisonerLaborView, PriInfoLaborType,

  PriRotlView, PriRotl,
  PriPrisonerBreak, PriPrisonerBreakView,
  
  PriRelease, PriReleaseView,

  PriTrainingView, PriTrainingPrisonerView, PriTraining, PriTrainingPrisoner, PriTrainingPrisonerKeyView,

  PriLoginLog, PriLoginLogView,

  PriOffenceActionView
]
export default Entities