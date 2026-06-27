import { AppHeader } from "@/components/ui/AppHeader";
import { useAuth } from "@/context/AuthContext";
import { ScrollView, StyleSheet, View } from "react-native";
import EmployeeProfileCard from "./EmployeeProfileCard";
import LeaveBalancesSection from "./leave-balance/LeaveBalancesSection";
import OvertimeAnalysisSection from "./ot-analysis/OvertimeAnalysisSection";

export default function DashboardScreen() {

  const { user, logout } = useAuth();

  return (
    <>

      <AppHeader title="Dashboard" />

      <ScrollView style={styles.scrollView}>

        <View style={styles.container}>

          <EmployeeProfileCard user={user} />

          <LeaveBalancesSection />

          <OvertimeAnalysisSection />

        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 12,
  },
  container: {
    gap: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
});