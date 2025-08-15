import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, router, useRouter } from "expo-router";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import  PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "react-native-vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NotransactionsFound";
import { RefreshControl } from "react-native";


export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const {transaction,summary,isloading,loadData,deleteTransaction} = useTransactions(user.id);

  const[refreshing,setRefreshing]=useState(false);

  useEffect(()=>{
    loadData();
  },[loadData]);

  const handleDelete=(id)=>{
    Alert.alert("Delete Transaction","Are you sure want to delete this transaction",[
      {text:"Cancel",style:"cancel"},
      {text:"Delete",style:"destructive" ,onPress:()=>deleteTransaction(id)},
    ])

  }


  const onRefresh=async()=>{
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if(isloading && !refreshing)
    return <PageLoader/>;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
            source={require("../../assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
            />
            <View style={styles.welcomeContainer}> 
              <Text style={styles.welcomeText}>
                Welcome,
              </Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={()=>router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF"/>
              <Text style={styles.addButtonText}>
                Add
              </Text>
            </TouchableOpacity>
            <SignOutButton/>
          </View>
        </View>

        <BalanceCard summary={summary}/>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
      style={styles.transactionsList}
      contentContainerStyle={styles.transactionContent}
      data={transaction}
      renderItem={({item})=>(
        <TransactionItem item={item} onDelete={handleDelete}/>
      )}
      ListEmptyComponent={<NoTransactionsFound/>}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </View>
  );
}
